import React, { useState, useEffect } from 'react';
import { useTemplateStore } from '../store/templateStore';
import TemplateCard from '../components/TemplateCard';
import TemplateForm from '../components/TemplateForm';
import { PlusCircle, Search } from 'lucide-react';

function Templates() {
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { templates, loading, fetchTemplates } = useTemplateStore();

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (template: Template) => {
    // TODO: Implement template usage in memory form
    console.log('Using template:', template);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">テンプレート</h2>
        <button
          onClick={() => setShowTemplateForm(true)}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:opacity-90 transition-opacity"
        >
          <PlusCircle className="h-4 w-4" />
          <span>新規作成</span>
        </button>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="テンプレートを検索..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="all">すべてのカテゴリー</option>
            <option value="general">一般</option>
            <option value="business">ビジネス</option>
            <option value="personal">個人</option>
            <option value="celebration">お祝い</option>
            <option value="gratitude">感謝</option>
          </select>
        </div>
      </div>

      {showTemplateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">新しいテンプレート</h2>
            <TemplateForm onClose={() => setShowTemplateForm(false)} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">テンプレートが見つかりません</p>
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              {...template}
              onDelete={() => useTemplateStore.getState().deleteTemplate(template.id)}
              onUpdate={(updates) => useTemplateStore.getState().updateTemplate(template.id, updates)}
              onUse={handleUseTemplate}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Templates;