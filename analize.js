import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
function avarage_price(posts) {
  let general_price = 0;
  for (let index = 0; index < posts.length; index++) {
    const post = posts[index];
    general_price += post.propeties_obj.price;
  }
  return general_price / posts.length;
}
function avarage_year(posts) {
  let general_year = 0;
  for (let index = 0; index < posts.length; index++) {
    const post = posts[index];
    general_year += post.propeties_obj.manufacture_year;
  }
  return general_year / posts.length;
}
function avarage_distance(posts) {
  let general_distance = 0;
  for (let index = 0; index < posts.length; index++) {
    const post = posts[index];
    general_distance += post.propeties_obj.distance;
  }
  return general_distance / posts.length;
}
async function main() {
  const posts = await prisma.post.findMany({});
  console.log("say:", posts.length);
  console.log(avarage_price(posts));
  console.log(avarage_year(posts));
  console.log(avarage_distance(posts));
}
main();
