import fs from 'node:fs'
import path from 'node:path'
import openapiTS, { astToString } from 'openapi-typescript'
import { factory } from 'typescript'

const File = factory.createTypeReferenceNode(
  factory.createIdentifier('File'),
)

async function generateTypes(schemaPth: string, outputPth: string) {
  const ast = await openapiTS(
    // OpenAPI スキーマファイルのパスを指定
    new URL(schemaPth, import.meta.url),
    {
      // @ts-ignore
      transform(schemaObject) {
        // binary format の場合、FormData型に変換
        if (schemaObject.format === 'binary') {
          return File
        }
      },
    },
  )

  const contents = astToString(ast)

  // 生成したい場所にファイルを出力
  fs.writeFileSync(
    path.resolve(process.cwd(), outputPth),
    contents,
  )
}

if (process.argv.length !== 4) {
  console.error('Usage: node generate-openapi-types.js <schema.json> <output.ts>');
  process.exit(1);
}

generateTypes(process.argv[2], process.argv[3]);
