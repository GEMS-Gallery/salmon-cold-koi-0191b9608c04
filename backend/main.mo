import Nat "mo:base/Nat";
import Text "mo:base/Text";

import Time "mo:base/Time";
import Array "mo:base/Array";
import Int "mo:base/Int";

actor {
  // Define the Post type
  type Post = {
    id: Nat;
    title: Text;
    body: Text;
    author: Text;
    category: Text;
    timestamp: Int;
  };

  // Store posts persistently
  stable var posts : [Post] = [];
  stable var nextId : Nat = 0;

  // Default category
  let defaultCategory = "General";

  // Get all posts, sorted by recency
  public query func getPosts() : async [Post] {
    Array.sort(posts, func(a: Post, b: Post) : { #less; #equal; #greater } {
      Int.compare(b.timestamp, a.timestamp)
    })
  };

  // Create a new blog post
  public func createPost(title: Text, body: Text, author: Text, category: Text) : async Nat {
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
