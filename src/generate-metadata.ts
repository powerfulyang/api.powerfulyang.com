import { PluginMetadataGenerator } from '@nestjs/cli/lib/compiler/plugins';
import { ReadonlyVisitor } from '@nestjs/swagger/dist/plugin';

const generator = new PluginMetadataGenerator();

generator.generate({
  filename: 'metadata.ts',
  visitors: [
    new ReadonlyVisitor({
      introspectComments: false,
      pathToSource: __dirname,
      classValidatorShim: false,
    }),
  ],
  outputDir: __dirname,
  tsconfigPath: 'tsconfig.build.json',
});
