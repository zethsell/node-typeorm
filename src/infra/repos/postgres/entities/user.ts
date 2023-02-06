import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Log } from '.'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name?: string

  @Column({ unique: true })
  email!: string

  @Column({ nullable: true })
  password!: string

  @Column({ default: false })
  admin?: boolean

  @Column({ name: 'first_access', nullable: true })
  firstAccess?: Date

  @Column({ name: 'last_access', nullable: true })
  lastAccess?: Date

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt?: Date

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt?: Date

  @OneToMany(() => Log, log => log.user, { lazy: false })
  logs?: Log[]
}
