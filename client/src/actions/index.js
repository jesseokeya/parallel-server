const url = window.location.hostname.includes("localhost")
  ? "http://localhost:8080"
  : "https://irdeto-parallel.herokuapp.com";

export const fetchDataAction = async (query, dispatch) => {
  const data = await fetch(`${url}/api/v1/comparison${query}`);
  const dataJSON = await data.json();
  return dispatch({
    type: "FETCH_SNAPSHOTS",
    payload: dataJSON.snapshots
  });
};
