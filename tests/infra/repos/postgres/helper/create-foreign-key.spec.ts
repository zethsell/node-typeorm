import { CreateForeignKey } from '@/infra/repos/postgres/helpers'
import { TableForeignKey } from 'typeorm'

describe('CreateForeignKey', () => {
  let sut: CreateForeignKey

  it('should call TableForeignKey with correct params', () => {
    sut = new CreateForeignKey('cd_categoria', 'cd_categoria', 'tb_categorias')
    const result = sut.new()
    expect(result).toEqual(new TableForeignKey({
      columnNames: ['cd_categoria'],
      referencedColumnNames: ['cd_categoria'],
      referencedTableName: 'tb_categorias',
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION'
    }))
  })

  it('should call TableForeignKey with correct params', () => {
    sut = new CreateForeignKey('cd_categoria', 'cd_categoria', 'tb_categorias', true)
    const result = sut.new()
    expect(result).toEqual(new TableForeignKey({
      columnNames: ['cd_categoria'],
      referencedColumnNames: ['cd_categoria'],
      referencedTableName: 'tb_categorias',
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION'
    }))
  })

  it('should call TableForeignKey with correct params', () => {
    sut = new CreateForeignKey('cd_categoria', 'cd_categoria', 'tb_categorias', false, true)
    const result = sut.new()
    expect(result).toEqual(new TableForeignKey({
      columnNames: ['cd_categoria'],
      referencedColumnNames: ['cd_categoria'],
      referencedTableName: 'tb_categorias',
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE'
    }))
  })

  it('should call TableForeignKey with correct params', () => {
    sut = new CreateForeignKey('cd_categoria', 'cd_categoria', 'tb_categorias', true, true)
    const result = sut.new()
    expect(result).toEqual(new TableForeignKey({
      columnNames: ['cd_categoria'],
      referencedColumnNames: ['cd_categoria'],
      referencedTableName: 'tb_categorias',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }))
  })
})
