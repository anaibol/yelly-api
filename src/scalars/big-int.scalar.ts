import { CustomScalar, Scalar } from '@nestjs/graphql'
import { Kind, ValueNode } from 'graphql'

@Scalar('BigInt', () => BigInt)
export class BigIntScalar implements CustomScalar<string, bigint> {
  description = 'BigInt scalar type'

  parseValue(value: any): bigint {
    return BigInt(value) // value from the client
  }

  serialize(value: any): string {
    return value.toString()
  }

  parseLiteral(ast: ValueNode): bigint {
    if (ast.kind === Kind.STRING) {
      return BigInt(ast.value)
    }

    return BigInt(0)
  }
}
