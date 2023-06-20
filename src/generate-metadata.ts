import { PluginMetadataGenerator } from '@nestjs/cli/lib/compiler/plugins';
import { ReadonlyVisitor } from '@nestjs/swagger/dist/plugin';

const generator = new PluginMetadataGenerator();
generator.generate({
  visitors: [
    new ReadonlyVisitor({
      pathToSource: __dirname,
      classValidatorShim: false,
      dtoFileNameSuffix: ['.dto.ts', '.entity.ts'],
      controllerFileNameSuffix: ['.controller.ts'],
      dtoKeyOfComment: 'description',
      controllerKeyOfComment: 'description',
      introspectComments: false,
      readonly: false,
    }),
  ],
  outputDir: __dirname,
  tsconfigPath: 'tsconfig.build.json',
});
