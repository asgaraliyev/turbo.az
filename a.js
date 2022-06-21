window.posts = [];
const myProfileIs = "my-profile-is-asgaraliyev";
function removeLettersFromNumber() {}
function convertHumanReadableToInt(str) {
  let result = str;
  if (result.includes("K") || result.includes("k")) {
    result = result.replace("K", "").trim();
    if (result.includes(".")) {
      const lengthAfterDot = result.slice(".")[1].length;
      result += "000";
      result = result.slice(0, -lengthAfterDot);
    } else {
      result += "000";
    }
  } else if (result.includes("M") || result.includes("m")) {
    result = result.replace("K", "").trim();
    if (result.includes(".")) {
      const lengthAfterDot = result.slice(".")[1].length;
      result += "000";
      result = result.slice(0, -lengthAfterDot);
    } else {
      result += "000";
    }
  } else if (result.includes("B") || result.includes("b")) {
    result = result.replace("K", "").trim();
    if (result.includes(".")) {
      const lengthAfterDot = result.slice(".")[1].length;
      result += "000";
      result = result.slice(0, -lengthAfterDot);
    } else {
      result += "000";
    }
  }

  result = parseFloat(result.replace(".", ""));
  return result;
}
function captureNetwork(myWindow, { onResponse }) {
  const origOpen = myWindow.XMLHttpRequest.prototype.open;
  myWindow.XMLHttpRequest.prototype.open = function () {
    this.addEventListener("load", function () {
      if (onResponse) {
        onResponse({
          body: this.responseText,
          URL: this.responseURL,
        });
      }
    });
    origOpen.apply(this, arguments);
  };
}
function addPost(post) {
  return new Promise((resolve, reject) => {
    try {
      if (post.media) {
        document.querySelector(
          "nav"
        ).innerHTML = `<iframe src="/${post.media.user.username}" id="${myProfileIs}"></iframe>`;
        const myIframe = document.querySelector(
          `#${myProfileIs}`
        ).contentWindow;
        myIframe.addEventListener("load", function () {
          console.log("iframe loaded");
          let observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              for (
                let index = 0;
                index < mutation?.addedNodes?.length;
                index++
              ) {
                const el = mutation.addedNodes[index];
                console.log(`el.textContent`, el.textContent);
                if (el.textContent.includes("Follow")) {
                  observer.disconnect();
                  post.media.user.followers = myIframe.document.querySelector(
                    `a[href="/${post.media.user.username}/followers/"]`
                  ).textContent;
                  post.media.user.following = myIframe.document.querySelector(
                    `a[href="/${post.media.user.username}/following/"]`
                  ).textContent;
                  console.log(
                    "post.media.user.following ",
                    post.media.user.followers
                  );
                  post.media.user.followers = convertHumanReadableToInt(
                    post.media.user.followers
                      .replace("following", "")
                      .replace("followers", "")
                  );
                  post.media.user.following = convertHumanReadableToInt(
                    post.media.user.following
                      .replace("following", "")
                      .replace("followers", "")
                  );
                  resolve(post);
                  window.posts.push(post);
                  break;
                }
              }
            });
          });

          observer.observe(myIframe.document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false,
          });
        });
      } else resolve();
    } catch (error) {
      console.error(error);
      console.log("post", post);
      resolve();
    }
  });
}
async function preparePostData(sItems, sItemsIndex) {
  const sectional_items = sItems[sItemsIndex];
  if (sectional_items) {
    if (sectional_items.layout_content.fill_items) {
      for (
        let index = 0;
        index < sectional_items.layout_content.fill_items.length;
        index++
      ) {
        const fillItem = sectional_items.layout_content.fill_items[index];
        await addPost(fillItem);
      }
    }
    if (sectional_items.layout_content.medias) {
      for (
        let index = 0;
        index < sectional_items.layout_content.medias.length;
        index++
      ) {
        const mediaItem = sectional_items.layout_content.medias[index];
        await addPost(mediaItem);
      }
    }
    if (sectional_items.layout_content.two_by_two_item) {
      const two_by_two_item = sectional_items.layout_content.two_by_two_item;
      await addPost(two_by_two_item);
    }
    await preparePostData(sItems, sItemsIndex + 1);
  }
}

function onResponse(response) {
  response.body = JSON.parse(response.body);
  if (response.body.status === "ok" && response.body.sectional_items) {
    preparePostData(response.body.sectional_items, 0);
  }
}
captureNetwork(window, { onResponse });
