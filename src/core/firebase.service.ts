import { Injectable } from '@nestjs/common'

import { getAuth, DecodedIdToken } from 'firebase-admin/auth'

@Injectable()
export class FirebaseService {
  deleteUser(firebaseId: string): Promise<void> {
    return getAuth().deleteUser(firebaseId)
  }

  verifyIdToken(idToken): Promise<DecodedIdToken> {
    return getAuth().verifyIdToken(idToken)
  }
}
