import { CustomScalar, Scalar } from '@nestjs/graphql'
import { Kind, ValueNode } from 'graphql'

@Scalar('BigInt', () => BigInt)
export class BigIntScalar implements CustomScalar<string, BigInt> {
  description = 'BigInt scalar type'

  parseValue(value: string): BigInt {
    return BigInt(value) // value from the client
  }

  serialize(value: BigInt): string {
    return value.toString()
  }

  parseLiteral(ast: ValueNode): BigInt | null {
    if (ast.kind === Kind.STRING) {
      return BigInt(ast.value)
    }

    return null
  }
}
