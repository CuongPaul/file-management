import { IParentFolder } from '@modules/folder/interfaces/parent-folder.interface';

const convertToNestedArray = (arr: IParentFolder[]) => {
	const map = new Map();

	arr.forEach((item) => {
		map.set(item.id, { ...item, children: [] });
	});

	const result = [];

	map.forEach((item) => {
		const parent = map.get(item.parent_folder_id);

		if (parent) {
			parent.children.push(item);
		} else {
			result.push(item);
		}
	});

	return result;
};

const convertToNestedObject = (rootItemId: string, arr: IParentFolder[]) => {
	const rootItem = arr.find((item) => item.id === rootItemId);
	const newArr = arr.filter((item) => item.id !== rootItemId);

	const parentFolderId = rootItem.parent_folder_id;

	if (parentFolderId) {
		delete rootItem.parent_folder_id;

		return {
			...rootItem,
			parent_folder: convertToNestedObject(parentFolderId, newArr),
		};
	} else {
		return rootItem;
	}
};

export { convertToNestedArray, convertToNestedObject };
