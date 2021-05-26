import { Injectable } from '@nestjs/common';
import { CompanyEnum } from '../../core/enum/company-enum';
import { RoleEnum } from '../../core/enum/role-enum';
import { UserEntity } from '../../core/entities/user/user.entity';
import { Brackets, SelectQueryBuilder, WhereExpression } from 'typeorm';
import { Logger } from '@nestjs/common';
import { PaginationModel } from '../../core/model/pagination-model';

@Injectable()
export class UserService {
  logger: Logger = new Logger(this.constructor.name);

  async query(
    query: string = '',
    pageSize?: number,
    pageIndex?: number,
  ): Promise<UserEntity[] | PaginationModel<UserEntity>> {
    // We are doing case insensitive search
    query = query.toLowerCase();

    // Replace Quotes by default since we are doing LIKE search
    query = query.replace(/"/gim, '');

    // We replace Operators to unify logic afterwards to always use [',' , '|', '-']
    query = query.replace(/ AND /gim, ' , ');
    query = query.replace(/ OR /gim, ' | ');
    query = query.replace(/ NOT /gim, ' - ');

    // Parse Operator Conditions
    const andConditions: string[] = UserService.getAndConditions(query);
    const orConditions: string[] = UserService.getOrConditions(query);
    const notConditions: string[] = UserService.getNotConditions(query);
    const allProperties: string = 'concat(lower(name) || lower(company) || lower(project) || lower(role))';

    // Select QueryBuilder
    const queryBuilder: SelectQueryBuilder<UserEntity> = UserEntity.createQueryBuilder('user').select('*');

    // Apply AND Conditions
    if (andConditions) {
      andConditions.forEach((arg: string) => queryBuilder.andWhere(`${allProperties} LIKE '%${arg}%'`));
    } else {
      // If only one Condition is passed on
      const firstVal: string[] = UserService.trimAndFilterValues(query.split(/[|,-]/gim)).slice(0, 1);
      queryBuilder.andWhere(`${allProperties} LIKE '%${firstVal}%'`);
    }

    // Check if OR Conditions are in brackets for override
    const usingBrackets: boolean = orConditions && orConditions.some((val) => val.match(/\(|\)/gim));

    if (usingBrackets) {
      // Higher precedence AND ( {1} OR {2} OR {3} )
      queryBuilder.andWhere(
        new Brackets((qb: WhereExpression) => {
          orConditions.forEach((arg) =>
            qb.orWhere(`${allProperties} LIKE '%${arg.replace('(', '').replace(')', '')}%'`),
          );
        }),
      );
    } else {
      orConditions?.forEach((arg: string) => queryBuilder.orWhere(`${allProperties} LIKE '%${arg}%'`));
    }

    // Apply Not conditions
    if (notConditions) {
      queryBuilder.andWhere(`${allProperties} NOT LIKE ANY('{${notConditions.map((v) => `%${v}%`).join(', ')}}')`);
    }

    // If no condition is found pass use LIKE %QUERY%
    if (!andConditions && !orConditions && !notConditions) {
      queryBuilder.andWhere(`${allProperties} ILIKE '%${query}%'`);
    }

    if (![pageSize, pageIndex].includes(undefined)) {
      return UserService.paginatedResult(queryBuilder, pageSize, pageIndex);
    }

    return await queryBuilder.execute();
  }

  private static async paginatedResult(
    queryBuilder: SelectQueryBuilder<UserEntity>,
    pageSize: number,
    pageIndex: number,
  ): Promise<PaginationModel<UserEntity>> {
    queryBuilder.skip(Math.max(0, pageIndex - 1) * pageSize).take(pageSize);

    const [items, total] = await Promise.all([
      // Get Many and count returns empty array for some reason
      queryBuilder.execute(),
      await queryBuilder.getCount(),
    ]);

    return {
      items,
      total,
      currentPage: pageIndex,
      pages: Math.ceil(total / pageSize),
      pageSize,
    };
  }

  private static getAndConditions(query: string): string[] {
    return UserService.trimAndFilterValues(
      query
        .match(/([A-z ]+[,]+)+?[^\(\|\-]+/gim)?.[0]
        .trim()
        .split(','),
    );
  }

  private static getOrConditions(query: string): string[] {
    return UserService.trimAndFilterValues(query.match(/\(?[A-z |]+\)|\|[| A-z]+/gim)?.[0].split('|'));
  }

  private static getNotConditions(query: string) {
    return UserService.trimAndFilterValues(query.match(/-[| A-z]+/gim)?.[0].split('-'));
  }

  private static trimAndFilterValues(exps: string[]): string[] {
    if (!exps) {
      return;
    }

    // Filter out empty strings and trim w/s from both ends
    return exps.filter((v) => !!v).map((v) => v.trim());
  }

  /**@debug */
  async initializeDatabase(): Promise<UserEntity[]> {
    const manualEntries = [
      {
        name: 'Ankur',
        company: CompanyEnum.IBM,
        project: 'Payroll',
        role: RoleEnum.SOFTWARE_ENGINEER,
        recordId: 1,
      },
      {
        name: 'Akash',
        company: CompanyEnum.IBM,
        project: 'Chat Bot',
        role: RoleEnum.SOFTWARE_ENGINEER,
        recordId: 2,
      },
      {
        name: 'Priya',
        company: CompanyEnum.HP,
        project: 'VR Gaming',
        role: RoleEnum.PROJECT_MANAGER,
        recordId: 3,
      },
      {
        name: 'Asha',
        company: CompanyEnum.MICROSOFT,
        project: 'Payroll',
        role: RoleEnum.SOLUTION_ARCHITECT,
        recordId: 4,
      },
      {
        name: 'Nandini',
        company: CompanyEnum.HP,
        project: 'Payroll',
        role: RoleEnum.SOFTWARE_ENGINEER,
        recordId: 5,
      },
      {
        name: 'Piyush',
        company: CompanyEnum.MICROSOFT,
        project: 'Payroll',
        role: RoleEnum.DELIVERY_MANAGER,
        recordId: 6,
      },
      {
        name: 'Ankur',
        company: CompanyEnum.HP,
        project: 'Chat Bot',
        role: RoleEnum.LEAD_ENGINEER,
        recordId: 7,
      },
      {
        name: 'Akash',
        company: CompanyEnum.HP,
        project: 'VR Gaming',
        role: RoleEnum.SOFTWARE_ENGINEER,
        recordId: 8,
      },
      {
        name: 'Priya',
        company: CompanyEnum.IBM,
        project: 'Payroll',
        role: RoleEnum.SOLUTION_ARCHITECT,
        recordId: 9,
      },
      {
        name: 'Asha',
        company: CompanyEnum.HP,
        project: 'Chat Bot',
        role: RoleEnum.PROJECT_MANAGER,
        recordId: 10,
      },
      {
        name: 'Nandini',
        company: CompanyEnum.IBM,
        project: 'VR Gaming',
        role: RoleEnum.LEAD_ENGINEER,
        recordId: 11,
      },
      {
        name: 'Piyush',
        company: CompanyEnum.MICROSOFT,
        project: 'Chat Bot',
        role: RoleEnum.DELIVERY_MANAGER,
        recordId: 12,
      },
    ];

    const entities = manualEntries.map((entry) => Object.assign(new UserEntity(), entry));

    // Insert with transaction breaking save execution to chunks of 200 length
    return await UserEntity.save(entities, { transaction: true, chunk: 200 });
  }
}
