var tweets = {
    1: {
        name: 'Preethi Kasireddy',
        username: '@iam_preethi',
        logo: 'https://pbs.twimg.com/profile_images/462295995531816964/-qH1C62A_normal.jpeg',
        text: 'When you hear a dogmatic opinion about some code, best practice or tool.. question it. Most things in programming are not so black & white.',
        time: '6:49 PM - 30 Oct 2016',
        retweets: 120,
        likes: 207,
        replies: [4,8,5]
    },
    2: {
        name: 'Preethi Kasireddy',
        username: '@iam_preethi',
        logo: 'https://pbs.twimg.com/profile_images/462295995531816964/-qH1C62A_normal.jpeg',
        text: 'My favorite thing about programming is the never-ending, "mind-blown", euphoric moments you have from learning or realizing something new',
        time: '11:14 PM - 15 Oct 2016',
        retweets: 95,
        likes: 259,
        replies: [9,3]
    },
    3: {
        name: 'Preethi Kasireddy',
        username: '@iam_preethi',
        logo: 'https://pbs.twimg.com/profile_images/462295995531816964/-qH1C62A_normal.jpeg',
        text: 'One of the hardest things as a programmer is knowing which rabbit holes are worth descending into',
        time: '5:21 AM - 7 Oct 2016',
        retweets: 521,
        likes: 945,
        replies: [6]
    },
    4: {
        name: 'Preethi Kasireddy',
        username: '@iam_preethi',
        logo: 'https://pbs.twimg.com/profile_images/462295995531816964/-qH1C62A_normal.jpeg',
        text: 'If you\'re worried about what other people will think of you for doing X or Y, dont be. Most people are too busy thinking about themselves',
        time: '7:15 PM - 29 Jun 2016',
        retweets: 30,
        likes: 60,
        replies: [10,7,11,2]
    },
    5: {
        name: 'Sebastian Markbåge',
        username: '@sebmarkbage',
        logo: 'https://pbs.twimg.com/profile_images/762857977036480513/G6HPkHDy_normal.jpg',
        text: 'My main goal with React isn\'t for the library/code to "win" but for the lessons learned not to go forgotten. That\'s surprisingly difficult.',
        time: '6:45 PM - 20 Oct 2016',
        retweets: 52,
        likes: 192,
        replies: [1,12,8]
    },
    6: {
        name: 'Sebastian Markbåge',
        username: '@sebmarkbage',
        logo: 'https://pbs.twimg.com/profile_images/762857977036480513/G6HPkHDy_normal.jpg',
        text: 'Each pattern by itself can\'t be said to be "best practice" without the context of other patterns it needs to work with.',
        time: '8:23 PM - 20 Sep 2016',
        retweets: 10,
        likes: 24,
        replies: [4,3]
    },
    7: {
        name: 'Sebastian Markbåge',
        username: '@sebmarkbage',
        logo: 'https://pbs.twimg.com/profile_images/762857977036480513/G6HPkHDy_normal.jpg',
        text: 'Server-side only doesn\'t work because high latency/fragile updates. Downloading JS on-demand doesn\'t work because slow to download+compile.',
        time: '5:37 AM - 16 Sep 2016',
        retweets: 2,
        likes: 13,
        replies: [6]
    },
    8: {
        name: 'Sebastian Markbåge',
        username: '@sebmarkbage',
        logo: 'https://pbs.twimg.com/profile_images/762857977036480513/G6HPkHDy_normal.jpg',
        text: 'Don\'t confuse identifying a problem with solving a problem. There\'s a very long tail that follows.',
        time: '8:15 AM - 30 Aug 2016',
        retweets: 15,
        likes: 40,
        replies: [10,9,7,2]
    },
    9: {
        name: 'Dan Abramov',
        username: '@dan_abramov',
        logo: 'https://pbs.twimg.com/profile_images/553711083064541184/9VsY9i09_normal.jpeg',
        text: 'Code is not just a static snapshot of the requirements and tradeoffs, but a living collaborative document pulled into many directions.',
        time: '5:29 PM - 31 Oct 2016',
        retweets: 27,
        likes: 63,
        replies: [7]
    },
    10: {
        name: 'Dan Abramov',
        username: '@dan_abramov',
        logo: 'https://pbs.twimg.com/profile_images/553711083064541184/9VsY9i09_normal.jpeg',
        text: 'Don\'t write "flexible" modules. No matter how you plan, you\'ll miss some future requirements. Write modules that are easy to delete.',
        time: '5:15 PM - 31 Oct 2016',
        retweets: 339,
        likes: 534,
        replies: [2,1,6,8]
    },
    11: {
        name: 'Dan Abramov',
        username: '@dan_abramov',
        logo: 'https://pbs.twimg.com/profile_images/553711083064541184/9VsY9i09_normal.jpeg',
        text: 'I like reaching that point when tests no longer express my wishes but help me discover and understand the system.',
        time: '4:06 PM - 28 Oct 2016',
        retweets: 9,
        likes: 70,
        replies: [4,10]
    },
    12: {
        name: 'Dan Abramov',
        username: '@dan_abramov',
        logo: 'https://pbs.twimg.com/profile_images/553711083064541184/9VsY9i09_normal.jpeg',
        text: 'I feel very anxious when I approach new code so I add logging everywhere. This helps so much.',
        time: '10:37 PM - 13 Oct 2016',
        retweets: 16,
        likes: 112,
        replies: [9,5]
    },
};

var getHome = () => {
    var homeTweets = [1,5,9,2,6,10];
    return homeTweets.map((id) => ({...tweets[id], id}));
}

var getTweet = (tweetId) => {
    var tweet = {...tweets[tweetId], id: tweetId};
    tweet.replies = tweet.replies.map((id) => ({...tweets[id], id}));
    return tweet;
}

export {getHome, getTweet};
