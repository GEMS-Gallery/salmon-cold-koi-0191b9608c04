import Nat "mo:base/Nat";
import Text "mo:base/Text";

import Time "mo:base/Time";
import Array "mo:base/Array";
import Int "mo:base/Int";
import Principal "mo:base/Principal";

actor {
  type Post = {
    id: Nat;
    title: Text;
    body: Text;
    author: Text;
    category: Text;
    timestamp: Int;
  };

  stable var posts : [Post] = [];
  stable var nextId : Nat = 0;

  let defaultCategory = "General";

  public query func getPosts() : async [Post] {
    Array.sort(posts, func(a: Post, b: Post) : { #less; #equal; #greater } {
      Int.compare(b.timestamp, a.timestamp)
    })
  };

  public shared(msg) func createPost(title: Text, body: Text, author: Text, category: Text) : async Nat {
    let caller = msg.caller;
    assert(not Principal.isAnonymous(caller));

    let postCategory = if (category == "") { defaultCategory } else { category };
    let post : Post = {
      id = nextId;
      title = title;
      body = body;
      author = author;
      category = postCategory;
      timestamp = Time.now();
    };
    posts := Array.append(posts, [post]);
    nextId += 1;
    post.id
  };
}
