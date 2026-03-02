import pool from "../config/db";
import { Contact, IdentifyResponse } from "../types/contact";
import { RowDataPacket } from "mysql2";

export async function identifyContact(
  email?: string,
  phoneNumber?: string
): Promise<IdentifyResponse> {

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [existing] = await connection.query<((Contact & RowDataPacket))[]>(
      `SELECT * FROM Contact
       WHERE (email = ? AND ? IS NOT NULL)
          OR (phoneNumber = ? AND ? IS NOT NULL)`,
      [email, email, phoneNumber, phoneNumber]
    );

    if (existing.length === 0) {
      const [result]: any = await connection.query(
        `INSERT INTO Contact (email, phoneNumber, linkPrecedence)
         VALUES (?, ?, 'primary')`,
        [email ?? null, phoneNumber ?? null]
      );

      await connection.commit();

      return {
        contact: {
          primaryContactId: result.insertId,
          emails: email ? [email] : [],
          phoneNumbers: phoneNumber ? [phoneNumber] : [],
          secondaryContactIds: []
        }
      };
    }

    const ids = existing.map(c => c.id);

    const [related] = await connection.query<((Contact & RowDataPacket))[]>(
      `SELECT * FROM Contact
       WHERE id IN (?) OR linkedId IN (?)`,
      [ids, ids]
    );

    related.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const primary = related[0];

    for (const contact of related) {
      if (
        contact.id !== primary.id &&
        contact.linkPrecedence === "primary"
      ) {
        await connection.query(
          `UPDATE Contact
           SET linkPrecedence = 'secondary',
               linkedId = ?
           WHERE id = ?`,
          [primary.id, contact.id]
        );
      }
    }

    const emailExists = related.some(c => c.email === email);
    const phoneExists = related.some(c => c.phoneNumber === phoneNumber);

    if ((email && !emailExists) || (phoneNumber && !phoneExists)) {
      await connection.query(
        `INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence)
         VALUES (?, ?, ?, 'secondary')`,
        [email ?? null, phoneNumber ?? null, primary.id]
      );
    }

    const [finalContacts] = await connection.query<((Contact & RowDataPacket))[]>(
      `SELECT * FROM Contact
       WHERE id = ? OR linkedId = ?`,
      [primary.id, primary.id]
    );

    await connection.commit();

    const emails = [
      ...new Set(finalContacts.map(c => c.email).filter(Boolean))
    ] as string[];

    const phoneNumbers = [
      ...new Set(finalContacts.map(c => c.phoneNumber).filter(Boolean))
    ] as string[];

    const secondaryIds = finalContacts
      .filter(c => c.linkPrecedence === "secondary")
      .map(c => c.id);

    return {
      contact: {
        primaryContactId: primary.id,
        emails,
        phoneNumbers,
        secondaryContactIds: secondaryIds
      }
    };

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}