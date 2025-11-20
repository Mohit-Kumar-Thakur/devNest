const API = "http://localhost:5000/api/events";

export const getEvents = async (): Promise<any> => {
  const res = await fetch(`${API}/all`);
  return res.json();
};

export const addEvent = async (data: any): Promise<any> => {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const updateEvent = async (id: string, data: any): Promise<any> => {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const deleteEvent = async (id: string): Promise<void> => {
  await fetch(`${API}/${id}`, { method: "DELETE" });
};
