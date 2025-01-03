import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const removeAllFiles = async () => {
  const getList = (await openai.files.list()).data;
  for (const file of getList) {
    await openai.files.del(file.id);
  }
};

const removeAllStores = async () => {
  const getList = (await openai.beta.vectorStores.list()).data;
  for (const store of getList) {
    const delStatus = await openai.beta.vectorStores.del(store.id);
    console.log(delStatus);
  }
};
