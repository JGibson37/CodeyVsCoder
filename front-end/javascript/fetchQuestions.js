export { fetchQuestion, fetchQuestions, submitQuestion };

const fetchQuestions = async () => {
  return fetch(`http://localhost:8080/api/questions/`).then((response) =>
    response.json()
  );
};

const fetchQuestion = async (id) => {
  return fetch(`http://localhost:8080/api/questions/${id}`).then((response) =>
    response.json()
  );
};

const submitQuestion = async (question) => {
  return fetch(`http://localhost:8080/api/questions/submitQuestion`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(question),
  }).then((response) => response.json());
};
