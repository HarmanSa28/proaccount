exports.handler = async () => {
  console.log("API FUNCTION ÇALIŞTI");

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true })
  };
};

