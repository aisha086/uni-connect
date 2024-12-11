import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { useAuthContext } from '../auth/AuthProvider';
import { db } from '../../lib/firebase';


export function FollowedSocietyPosts({ }) {
    const [posts, setPosts] = useState([]);
    const [followingList, setFollowingList] = useState([]);
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchPosts = async () => {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const followedSocieties = userDoc.data().followedSocieties || [];
                setFollowingList(followedSocieties);
            }

            let postsList = [];
            
            if(followingList.length > 0) {
                const postsCollection = collection(db, 'posts');

                for (const society of followingList) {
                    const q = query(
                        postsCollection,
                        where('societyId', '==', society)
                    );

                    const postsSnapshot = await getDocs(q);
                    postsList.push(...postsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    })));
                }
            }

            const sortedPosts = postsList.sort((a, b) =>
                new Date(b.creationDate) - new Date(a.creationDate)
            );
            setPosts(sortedPosts);
        };

        fetchPosts();
    }, [user, followingList]);


    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Society Posts</h2>
            {posts.length === 0 ? (
                <p>No posts to show.</p>
            ) : (
                <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-1 max-w-full">
                    {/* to make sure post doesnt have arrays of arrays */}
                    {posts.flat().map(post => (
                        <div key={post.id} className="bg-[#6A1E55] p-4 rounded-lg max-w-[50vh]">
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

