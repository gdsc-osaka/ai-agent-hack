import React from 'react';
import { ConversationTopic } from '@/lib/types'

interface WordCloudProps {
  topics: ConversationTopic[];
}

export const WordCloud: React.FC<WordCloudProps> = ({ topics }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'personal': return 'text-blue-400';
      case 'business': return 'text-green-400';
      case 'entertainment': return 'text-purple-400';
      case 'lifestyle': return 'text-amber-400';
      case 'food': return 'text-red-400';
      case 'travel': return 'text-indigo-400';
      default: return 'text-gray-400';
    }
  };

  const getFontSize = (frequency: number, maxFrequency: number) => {
    const minSize = 12;
    const maxSize = 32;
    const ratio = frequency / maxFrequency;
    return Math.floor(minSize + (maxSize - minSize) * ratio);
  };

  const maxFrequency = Math.max(...topics.map(t => t.frequency));

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'personal': return '個人';
      case 'business': return 'ビジネス';
      case 'entertainment': return 'エンタメ';
      case 'lifestyle': return 'ライフスタイル';
      case 'food': return '飲食';
      case 'travel': return '旅行';
      default: return 'その他';
    }
  };

  const groupedTopics = topics.reduce((acc, topic) => {
    if (!acc[topic.category]) {
      acc[topic.category] = [];
    }
    acc[topic.category].push(topic);
    return acc;
  }, {} as Record<string, ConversationTopic[]>);

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h3 className="text-white font-semibold text-lg mb-6">会話トピック</h3>
      
      {/* Category Legend */}
      <div className="flex flex-wrap gap-4 mb-6">
        {Object.keys(groupedTopics).map(category => (
          <div key={category} className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getCategoryColor(category).replace('text-', 'bg-')}`}></div>
            <span className="text-gray-400 text-sm">{getCategoryLabel(category)}</span>
          </div>
        ))}
      </div>

      {/* Word Cloud */}
      <div className="min-h-48 flex flex-wrap items-center justify-center gap-2 bg-gray-900/50 rounded-lg p-6">
        {topics
          .sort((a, b) => b.frequency - a.frequency)
          .map((topic, index) => (
            <span
              key={index}
              className={`${getCategoryColor(topic.category)} font-medium hover:opacity-75 transition-opacity cursor-pointer`}
              style={{ 
                fontSize: `${getFontSize(topic.frequency, maxFrequency)}px`,
                lineHeight: 1.2
              }}
              title={`${topic.text} (${topic.frequency}回, ${getCategoryLabel(topic.category)})`}
            >
              {topic.text}
            </span>
          ))}
      </div>

      {/* Topic Statistics */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(groupedTopics).map(([category, categoryTopics]) => (
          <div key={category} className="bg-gray-700/30 rounded-lg p-3">
            <div className={`text-sm font-medium ${getCategoryColor(category)}`}>
              {getCategoryLabel(category)}
            </div>
            <div className="text-white text-lg font-semibold">
              {categoryTopics.reduce((sum, topic) => sum + topic.frequency, 0)}
            </div>
            <div className="text-gray-400 text-xs">
              {categoryTopics.length}トピック
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};