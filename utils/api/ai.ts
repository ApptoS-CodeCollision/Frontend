const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 공통 fetch 요청 처리 함수
async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    const errorData = await response.text();
    console.error(
      `Error: ${response.status} ${response.statusText}\n${errorData}`
    );
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }
  return await response.json();
}

// API URL 상수화
const AI_API = {
  TREND: (address: string, category: string) =>
    `/ais/trend/${address}/${category}`,
  LIST: "/ais/",
  TODAY: (address: string) => `/ais/today/${address}`,
  DETAILS: (id: string) => `/ais/id/${id}`,
  SEARCH: (name: string, address: string) => `/ais/search/${name}/${address}`,
  LOGS: (id: string) => `/ailogs/ai/${id}`,
  USER: (userid: string) => `/ais/user/${userid}`,
  DELETE: (id: string) => `/ai/${id}`,
};

// API 요청 함수들

export async function fetchTrendingAIs(
  category: string,
  address: string,
  query: { offset?: number; limit?: number } = {}
) {
  const { offset = 0, limit = 10 } = query;
  const endpoint = `${AI_API.TREND(
    address,
    category
  )}?offset=${offset}&limit=${limit}`;
  return await apiRequest(endpoint);
}

export async function fetchAIs(offset: number, limit: number) {
  return await apiRequest(`${AI_API.LIST}?offset=${offset}&limit=${limit}`);
}

export async function fetchTodayAIs(address: string) {
  return await apiRequest(AI_API.TODAY(address));
}

export async function fetchAIDetails(id: string) {
  return await apiRequest(AI_API.DETAILS(id));
}

export async function fetchSearchAIs(name: string, address: string) {
  try {
    return await apiRequest(AI_API.SEARCH(name, address));
  } catch (error: any) {
    if (error.message.includes("404")) {
      throw new Error("No results found");
    }
    throw error;
  }
}

export async function fetchAILogs(id: string) {
  return await apiRequest(AI_API.LOGS(id));
}

export async function createAI(aiData: {
  name: string;
  creator_address: string;
  category: string;
  introductions: string;
  profile_image_url: string;
  rag_contents: string;
  rag_comments: string;
  created_at: string;
  examples: string;
}) {
  return await apiRequest(AI_API.LIST, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(aiData),
  });
}

export async function fetchMyAIs(userid: string) {
  return await apiRequest(AI_API.USER(userid));
}

export async function deleteAI(id: string) {
  return await apiRequest(AI_API.DELETE(id), { method: "DELETE" });
}

export async function updateAI(aiData: {
  id: string;
  creator_address: string;
  profile_image_url: string;
  category: string;
  introductions: string;
  rag_contents: string;
  rag_comments: string;
  examples: string;
  created_at: string;
}) {
  return await apiRequest(AI_API.LIST, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(aiData),
  });
}
