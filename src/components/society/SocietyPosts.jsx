import { useState, useEffect } from 'react';
import { collection, query, where, getDocs,  deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Button } from '../ui/Button';


export function SocietyPosts({ societyId, canManage }) {
  const [posts, setPosts] = useState([]);


  useEffect(() => {
    const fetchPosts = async () => {
      const postsCollection = collection(db, 'posts');
      const q = query(
        postsCollection,
        where('societyId', '==', societyId)
      );
      const postsSnapshot = await getDocs(q);
      const postsList = postsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const sortedPosts = postsList.sort((a, b) => 
        new Date(b.creationDate) - new Date(a.creationDate)
      );
      setPosts(sortedPosts);
    };

    fetchPosts();
  }, [societyId]);

  const handleDelete = async (postId) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
      // Update local state to remove the deleted post
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Society Posts</h2>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-1 max-w-full">
          {posts.map(post => (
            <div key={post.id} className="bg-[#6A1E55] p-4 rounded-lg max-w-[50vh] relative">
               {canManage && (
                <Button
                  onClick={() => handleDelete(post.id)}
                  className="absolute top-2 right-2"
                >
                  Delete
                  </Button> 
              )}
              <h3 className="font-bold text-lg">{post.title}</h3>
              <p className="text-sm mb-2">{post.caption}</p>
              {post.imageUrl && (
                <img src={post.imageUrl} alt={post.title} className="mt-2 rounded-md max-w-full h-auto" />
              )}
              <p className="text-xs mt-2 text-gray-300">{new Date(post.creationDate).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

