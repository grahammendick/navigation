const accounts = {
  1: {
    name: 'Preethi Kasireddy',
    username: '@iam_preethi',
    logo: require('./iam_preethi.jpeg'),
    bio: 'Software Engineer @coinbase. Previously @a16z & @GoldmanSachs. Besides doing nerdy things, I love running & reading. I believe in the magic of thinking big :)',
    following: 763,
    followers: 6722,
    tweets: [1, 2, 5, 3, 4]
  },
  2: {
    name: 'Sebastian Markbåge',
    username: '@sebmarkbage',
    logo: require('./sebmarkbage.jpg'),
    bio: 'React JS · TC39 · The Facebook · Tweets are personal',
    following: 354,
    followers: 14319,
    tweets: [5, 6, 9, 7, 8]
  },
  3: {
    name: 'Dan Abramov',
    username: '@dan_abramov',
    logo: require('./dan_abramov.jpeg'),
    bio: 'Co-authored Redux, Create React App, React Hot Loader, React DnD. Helping improve @reactjs. Personal opinions. #juniordevforlife',
    following: 1576,
    followers: 52822,
    tweets: [9, 10, 1, 11, 12]
  }
};

const tweets = {
  1: {
    account: 1,
    text: 'When you hear a dogmatic opinion about some code, best practice or tool.. question it. Most things in programming are not so black & white.',
    time: '6:49 PM - 30 Oct 2016',
    retweets: 120,
    likes: 207,
    replies: [4, 8, 5]
  },
  2: {
    account: 1,
    text: 'My favorite thing about programming is the never-ending, "mind-blown", euphoric moments you have from learning or realizing something new',
    time: '11:14 PM - 15 Oct 2016',
    retweets: 95,
    likes: 259,
    replies: [9, 3]
  },
  3: {
    account: 1,
    text: 'One of the hardest things as a programmer is knowing which rabbit holes are worth descending into',
    time: '5:21 AM - 7 Oct 2016',
    retweets: 521,
    likes: 945,
    replies: [6]
  },
  4: {
    account: 1,
    text: 'If you\'re worried about what other people will think of you for doing X or Y, dont be. Most people are too busy thinking about themselves',
    time: '7:15 PM - 29 Jun 2016',
    retweets: 30,
    likes: 60,
    replies: [10, 7, 11, 2]
  },
  5: {
    account: 2,
    text: 'My main goal with React isn\'t for the library/code to "win" but for the lessons learned not to go forgotten. That\'s surprisingly difficult.',
    time: '6:45 PM - 20 Oct 2016',
    retweets: 52,
    likes: 192,
    replies: [1, 12, 8]
  },
  6: {
    account: 2,
    text: 'Each pattern by itself can\'t be said to be "best practice" without the context of other patterns it needs to work with.',
    time: '8:23 PM - 20 Sep 2016',
    retweets: 10,
    likes: 24,
    replies: [4, 3]
  },
  7: {
    account: 2,
    text: 'Server-side only doesn\'t work because high latency/fragile updates. Downloading JS on-demand doesn\'t work because slow to download+compile.',
    time: '5:37 AM - 16 Sep 2016',
    retweets: 2,
    likes: 13,
    replies: [6]
  },
  8: {
    account: 2,
    text: 'Don\'t confuse identifying a problem with solving a problem. There\'s a very long tail that follows.',
    time: '8:15 AM - 30 Aug 2016',
    retweets: 15,
    likes: 40,
    replies: [10, 9, 7, 2]
  },
  9: {
    account: 3,
    text: 'Code is not just a static snapshot of the requirements and tradeoffs, but a living collaborative document pulled into many directions.',
    time: '5:29 PM - 31 Oct 2016',
    retweets: 27,
    likes: 63,
    replies: [7]
  },
  10: {
    account: 3,
    text: 'Don\'t write "flexible" modules. No matter how you plan, you\'ll miss some future requirements. Write modules that are easy to delete.',
    time: '5:15 PM - 31 Oct 2016',
    retweets: 339,
    likes: 534,
    replies: [2, 1, 6, 8]
  },
  11: {
    account: 3,
    text: 'I like reaching that point when tests no longer express my wishes but help me discover and understand the system.',
    time: '4:06 PM - 28 Oct 2016',
    retweets: 9,
    likes: 70,
    replies: [4, 10]
  },
  12: {
    account: 3,
    text: 'I feel very anxious when I approach new code so I add logging everywhere. This helps so much.',
    time: '10:37 PM - 13 Oct 2016',
    retweets: 16,
    likes: 112,
    replies: [9, 5]
  },
};

const fetchTweet = id => ({
  id,
  ...tweets[id],
  account: {
    id: tweets[id].account,
    ...accounts[tweets[id].account]
  }
});

const getHome = () => {
  const homeTweets = [1, 5, 9, 2, 6, 10];
  return homeTweets.map(id => fetchTweet(id));
};

const getFollows = () => {
  const notifications = [1, 2, 3];
  return notifications.map(id => ({...accounts[id], id}));
};

const getTweet = id => {
  const tweet = fetchTweet(id);
  tweet.replies = tweet.replies.map(replyId => fetchTweet(replyId));
  return tweet;
};

const getTimeline = id => {
  const timeline = { ...accounts[id], id };
  timeline.tweets = timeline.tweets.map(tweetId => fetchTweet(tweetId));
  return timeline;
};

export {getHome, getFollows, getTweet, getTimeline};
