module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'type-empty': [2, 'never'],
		'scope-empty': [2, 'never'],
		'subject-empty': [2, 'never'],
		'header-max-length': [2, 'always', 72],
		'subject-full-stop': [2, 'never', '.'],
		'type-case': [2, 'always', 'lower-case'],
		'type-enum': [
			2,
			'always',
			[
				'fix', // Sửa lỗi
				'test', // Viết test
				'docs', // Thêm tài liệu
				'feat', // Tính năng mới
				'build', // Build tệp tin
				'improve', // Cải thiện code
				'ci', // Thay đổi cấu hình CI/CD
				'refactor', // Tái cấu trúc code
				'revert', // Revert lại commit trước đó
				'chore', // Thay đổi nhỏ trong quá trình phát triển
				'style', // Sửa lỗi kiểu chữ, định dạng, không ảnh hưởng đến logic
			],
		],
	},
};
