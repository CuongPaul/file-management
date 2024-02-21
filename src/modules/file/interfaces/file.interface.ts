export interface IFile {
	id: string;
	url: string;
	name: string;
	size?: number;
	type?: string;
	user_id: string;
	folder_id?: string;
}
