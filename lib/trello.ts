export type TrelloLabel = {
  id: string;
  name: string;
  color: string | null;
};

export type TrelloCard = {
  id: string;
  name: string;
  desc: string;
  shortUrl: string;
  labels: TrelloLabel[];
  dateLastActivity: string | null;
  due: string | null;
};

export type TrelloList = {
  id: string;
  name: string;
};

export type TrelloComment = {
  id: string;
  date: string;
  memberCreator: { fullName: string; username: string };
  data: { text: string };
};

export type TrelloAttachment = {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  date: string;
};

function trelloUrl(path: string, params: Record<string, string> = {}): string {
  const key = process.env.TRELLO_API_KEY!.trim();
  const token = process.env.TRELLO_TOKEN!.trim();
  const url = new URL(`https://api.trello.com/1${path}`);
  url.searchParams.set("key", key);
  url.searchParams.set("token", token);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return url.toString();
}

async function trelloFetch(
  path: string,
  options: RequestInit = {},
  params: Record<string, string> = {}
): Promise<Response> {
  const headers: Record<string, string> = options.body
    ? { "Content-Type": "application/json" }
    : {};
  const res = await fetch(trelloUrl(path, params), {
    ...options,
    headers: { ...headers, ...options.headers },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Trello API error ${res.status}: ${text}`);
  }
  return res;
}

export async function getBoardCards(boardId: string): Promise<TrelloCard[]> {
  const res = await trelloFetch(`/boards/${boardId}/cards`, {}, {
    fields: "name,desc,shortUrl,labels",
  });
  return res.json();
}

export async function getBoardLists(boardId: string): Promise<TrelloList[]> {
  const res = await trelloFetch(`/boards/${boardId}/lists`, {}, {
    fields: "id,name",
  });
  return res.json();
}

export async function getListCards(listId: string): Promise<TrelloCard[]> {
  const res = await trelloFetch(`/lists/${listId}/cards`, {}, {
    fields: "name,desc,shortUrl,labels,dateLastActivity,due",
  });
  return res.json();
}

export async function getCard(cardId: string): Promise<TrelloCard> {
  const res = await trelloFetch(`/cards/${cardId}`, {}, {
    fields: "name,desc,shortUrl,idLabels,labels,dateLastActivity,due",
  });
  return res.json();
}

export async function addCardComment(cardId: string, text: string): Promise<void> {
  await trelloFetch(`/cards/${cardId}/actions/comments`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

export async function getBoardLabels(boardId: string): Promise<TrelloLabel[]> {
  const res = await trelloFetch(`/boards/${boardId}/labels`);
  return res.json();
}

export async function getFullBoardId(boardId: string): Promise<string> {
  const res = await trelloFetch(`/boards/${boardId}`, {}, { fields: "id" });
  const board = await res.json();
  return board.id;
}

export async function addCardLabel(cardId: string, labelId: string): Promise<void> {
  await trelloFetch(`/cards/${cardId}/idLabels`, { method: "POST" }, { value: labelId });
}

export async function removeCardLabel(
  cardId: string,
  labelId: string
): Promise<void> {
  await trelloFetch(`/cards/${cardId}/idLabels/${labelId}`, {
    method: "DELETE",
  });
}

export async function createLabel(boardId: string, name: string, color: string): Promise<TrelloLabel> {
  const res = await trelloFetch(`/labels`, { method: "POST" }, { name, color, idBoard: boardId });
  return res.json();
}

export async function getCardComments(cardId: string): Promise<TrelloComment[]> {
  const res = await trelloFetch(`/cards/${cardId}/actions`, {}, {
    filter: "commentCard",
    limit: "20",
  });
  return res.json();
}

export async function getCardAttachments(cardId: string): Promise<TrelloAttachment[]> {
  const res = await trelloFetch(`/cards/${cardId}/attachments`, {}, {
    fields: "id,name,url,mimeType,date",
  });
  const all: TrelloAttachment[] = await res.json();
  return all.filter((a) => a.mimeType.startsWith("image/"));
}
