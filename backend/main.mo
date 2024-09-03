import Nat "mo:base/Nat";

import Time "mo:base/Time";
import Array "mo:base/Array";
import Int "mo:base/Int";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import Result "mo:base/Result";
import Buffer "mo:base/Buffer";
import Text "mo:base/Text";

actor {
  type Post = {
    id: Nat;
    title: Text;
    body: Text;
    author: Text;
    category: Text;
    timestamp: Int;
  };

  stable var postEntries : [(Nat, Post)] = [];
  var posts = Buffer.Buffer<Post>(10);

  stable var nextId : Nat = 0;

  let defaultCategory = "General";

  system func preupgrade() {
    postEntries := Array.map<Post, (Nat, Post)>(Buffer.toArray(posts), func (p: Post) : (Nat, Post) { (p.id, p) });
  };

  system func postupgrade() {
    for ((id, post) in postEntries.vals()) {
      posts.add(post);
    };
    postEntries := [];
  };

  public query func getPosts() : async [Post] {
    Buffer.toArray(posts)
  };

  public shared(msg) func createPost(title: Text, body: Text, author: Text, category: Text) : async Result.Result<Nat, Text> {
    if (Text.size(title) == 0 or Text.size(body) == 0 or Text.size(author) == 0) {
      return #err("Title, body, and author cannot be empty");
    };

    let caller = msg.caller;
    if (Principal.isAnonymous(caller)) {
      return #err("Authentication required");
    };

    let postCategory = if (Text.size(category) == 0) { defaultCategory } else { category };
    let post : Post = {
      id = nextId;
      title = title;
      body = body;
      author = author;
      category = postCategory;
      timestamp = Time.now();
    };
    posts.add(post);
    nextId += 1;
    Debug.print("Post created successfully: " # debug_show(post));
    #ok(post.id)
  };

  public query func healthCheck() : async Text {
    "Canister is healthy"
  };
}
