// Vision Guard - Service de signalement et modération
import { VisionReport, Post, User } from '../types';

const REPORTS_STORAGE_KEY = 'vision_reports';

export const reportPost = async (post: Post, reporter: User, reason: string): Promise<VisionReport> => {
  const report: VisionReport = {
    id: Date.now().toString(),
    postId: post.id,
    reporterId: reporter.id,
    reason,
    timestamp: Date.now(),
    postTitle: post.title,
    postCaption: post.caption
  };

  // Sauvegarder localement
  const reports = getReports();
  reports.push(report);
  localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));

  return report;
};

export const getReports = (): VisionReport[] => {
  const data = localStorage.getItem(REPORTS_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const resolveReport = (reportId: string, accepted: boolean): void => {
  const reports = getReports();
  const updated = reports.map(r => 
    r.id === reportId ? { ...r, resolved: true, accepted } : r
  );
  localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updated));
};

export const deletePostByReport = (postId: string): void => {
  console.log(`Post ${postId} supprimé par Vision Guard`);
};
