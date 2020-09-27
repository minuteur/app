class WebpackMigrationSource {
    constructor (migrationContext) {
      this.migrationContext = migrationContext;
    }

    getMigrations () {
        return Promise.resolve(this.migrationContext.keys().sort())
    }

    getMigrationName (migration) {
      return migration
    }

    getMigration (migration) {
        return this.migrationContext(migration)
    }
}

export default WebpackMigrationSource
