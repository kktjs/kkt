import { resolveModuleName } from 'ts-pnp';
import * as ts from 'typescript';

exports.resolveModuleName = (
  typescript: any,
  moduleName: string,
  containingFile: string,
  compilerOptions: ts.CompilerOptions,
  resolutionHost: ts.ModuleResolutionHost
) => {
  return resolveModuleName(
    moduleName,
    containingFile,
    compilerOptions,
    resolutionHost,
    typescript.resolveModuleName
  );
};

exports.resolveTypeReferenceDirective = (
  typescript: any,
  moduleName: string,
  containingFile: string,
  compilerOptions: ts.CompilerOptions,
  resolutionHost: ts.ModuleResolutionHost
) => {
  return resolveModuleName(
    moduleName,
    containingFile,
    compilerOptions,
    resolutionHost,
    typescript.resolveTypeReferenceDirective
  );
};
