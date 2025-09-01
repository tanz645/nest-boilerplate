import { ObjectId } from 'mongodb';

/**
 * Utility functions for ObjectId operations that can be used in DTOs
 */
export class ObjectIdUtil {
  /**
   * Creates ObjectId from hex string
   * @param hexString - 24 character hex string
   * @returns ObjectId
   */
  static fromHexString(hexString: string): ObjectId {
    return ObjectId.createFromHexString(hexString);
  }

  /**
   * Safely converts a value to ObjectId
   * @param value - The value to convert (string or ObjectId)
   * @returns ObjectId
   */
  static toObjectId(value: string | ObjectId): ObjectId {
    if (typeof value === 'string') {
      return ObjectId.createFromHexString(value);
    }
    return value;
  }

  /**
   * Safely converts an array of values to ObjectIds
   * @param values - Array of values to convert
   * @returns Array of ObjectIds
   */
  static toObjectIds(values: (string | ObjectId)[]): ObjectId[] {
    return values.map((value) => this.toObjectId(value));
  }
}
