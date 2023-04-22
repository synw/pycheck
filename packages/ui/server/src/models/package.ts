export default class PythonPackage {
  pipName: string;
  packageName: string;
  version: string;

  constructor(pipName: string, packageName: string, version?: string) {
    this.pipName = pipName;
    this.packageName = packageName;
    this.version = version ?? "";
  }
}