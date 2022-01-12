import { Injectable } from '@nestjs/common'

import { getAuth, DecodedIdToken } from 'firebase-admin/auth'

@Injectable()
export class FirebaseService {
  async deleteUser(firebaseId: string): Promise<void> {
    return getAuth().deleteUser(firebaseId)
  }

  async verifyIdToken(idToken): Promise<DecodedIdToken> {
    return getAuth().verifyIdToken(idToken)
  }
}
