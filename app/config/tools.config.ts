export default {
  tools: [
    {
      id: 'document-generator',
      name: 'AI Document Generator',
      description: '使用AI生成专业文档',
      icon: 'mdi:file-document',
      path: '/app/document',
      isEnabled: true,
      features: [
        {
          id: 'ai-generation',
          name: 'AI生成',
          description: '使用AI快速生成文档内容',
          isEnabled: true,
        },
        {
          id: 'template-selection',
          name: '模板选择',
          description: '从多种专业模板中选择',
          isEnabled: true,
        },
        {
          id: 'export-options',
          name: '导出选项',
          description: '以多种格式导出您的文档',
          isEnabled: true,
        }
      ]
    }
  ],
  maxDocuments: 10,
  exportFormats: ['pdf', 'docx', 'txt'],
  defaultLanguage: 'zh',
  aiProviders: {
    default: 'openai',
    providers: [
      {
        id: 'openai',
        name: 'OpenAI',
        apiKeyRequired: true,
        isEnabled: true,
      }
    ]
  }
} 