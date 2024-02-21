import {
	Model,
	Table,
	Column,
	Default,
	HasMany,
	DataType,
	AllowNull,
	BelongsTo,
	ForeignKey,
	PrimaryKey,
} from 'sequelize-typescript';

import File from '@modules/file/models/file.model';
import User from '@modules/user/models/user.model';
import Share from '@modules/share/models/share.model';

@Table({
	tableName: 'folder',
	createdAt: 'created_at',
	updatedAt: 'updated_at',
})
export default class Folder extends Model {
	@PrimaryKey
	@Default(DataType.UUIDV4)
	@Column({ type: DataType.UUID })
	id: string;

	@ForeignKey(() => Folder)
	@Column({ type: DataType.UUID })
	parent_folder_id: string;

	@AllowNull(false)
	@Column({ type: DataType.STRING })
	name: string;

	@AllowNull(false)
	@ForeignKey(() => User)
	@Column({ type: DataType.UUID })
	user_id: string;

	@BelongsTo(() => User)
	user: User;

	@HasMany(() => File, { foreignKey: 'folder_id', onDelete: 'CASCADE' })
	files: File[];

	@HasMany(() => Share, { foreignKey: 'folder_id', onDelete: 'CASCADE' })
	shares: Share[];
}
