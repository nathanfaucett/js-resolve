module.exports = Dependency;


function Dependency(fullPath, pkgFullPath, pkg) {
    this.fullPath = fullPath;
    this.pkgFullPath = pkgFullPath;
    this.pkg = pkg;
}
