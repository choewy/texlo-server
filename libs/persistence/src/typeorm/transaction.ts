import { Provider } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';

export type TypeOrmTransactionContextFactory<TContext> = (entityManager: EntityManager) => TContext;
export type TypeOrmTransactionProviderContextFactory<TContext> = (props: { dataSource: DataSource; entityManager: EntityManager }) => TContext;

export class TypeOrmTransaction<TContext> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly createContext: TypeOrmTransactionContextFactory<TContext>,
  ) {}

  transaction<T>(run: (context: TContext) => Promise<T>): Promise<T> {
    return this.dataSource.transaction((entityManager) => run(this.createContext(entityManager)));
  }

  static toProvider<TContext>(provide: string | symbol, createContext: TypeOrmTransactionProviderContextFactory<TContext>): Provider {
    return {
      provide,
      inject: [DataSource],
      useFactory(dataSource: DataSource) {
        return new TypeOrmTransaction<TContext>(dataSource, (entityManager) => createContext({ dataSource, entityManager }));
      },
    };
  }
}
