import tweetsData from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'

const feeds = document.getElementById('feeds')

let tweets = JSON.parse(localStorage.getItem('twimba-tweets')) || tweetsData

render()

document.getElementById('tweet-form').addEventListener('submit', handleTweetSubmit)
feeds.addEventListener('click', handleFeedsClick)

function render() {
    localStorage.setItem('twimba-tweets', JSON.stringify(tweets))
    feeds.innerHTML = getFeedHtml()
}

function getFeedHtml() {
    return tweets.map(tweet => {
        const repliesHtml =
            tweet.replies.map(({ profilePic, handle, tweetText }) => `
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${profilePic}" class="profile-pic">
        <div>
            <p class="handle">${handle}</p>
            <p class="tweet-text">${tweetText}</p>
        </div>
    </div>
</div>`)

        repliesHtml.unshift(`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="images/scrimbalogo.png" class="profile-pic">
        <textarea class="tweet-input" placeholder="What's up?" id="comment-input-${tweet.uuid}"></textarea>
    </div>

    <button class="btn" data-comment="${tweet.uuid}">Reply</button>
</div>`)

        return `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>

            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                        data-reply="${tweet.uuid}"></i>
                    ${tweet.replies.length}
                </span>

                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${tweet.isLiked ? 'liked' : ''}"
                        data-like="${tweet.uuid}"></i>
                    ${tweet.likes}
                </span>

                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${tweet.isRetweeted ? 'retweeted' : ''}"
                        data-retweet="${tweet.uuid}"></i>
                    ${tweet.retweets}
                </span>

                <span class="tweet-detail">
                    <i class="fa-solid fa-trash"
                        data-delete="${tweet.uuid}"></i>
                </span>
            </div>   
        </div>            
    </div>

    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml.join('')}
    </div>   
</div>`
    }).join('')
}

function handleTweetSubmit(e) {
    e.preventDefault()
    const tweetInput = document.getElementById('tweet-input')

    if (!tweetInput.value) return

    tweets.unshift({
        handle: `@Scrimba`,
        profilePic: `images/scrimbalogo.png`,
        likes: 0,
        retweets: 0,
        tweetText: tweetInput.value,
        replies: [],
        isLiked: false,
        isRetweeted: false,
        uuid: uuidv4()
    })
    tweetInput.value = ''
    render()
}

function handleFeedsClick(e) {
    const dataset = e.target.dataset
    if (dataset.reply) {
        handleReplyClick(dataset.reply)
    } else if (dataset.like) {
        handleLikeClick(dataset.like)
    } else if (dataset.retweet) {
        handleRetweetClick(dataset.retweet)
    } else if (dataset.delete) {
        handleDeleteClick(dataset.delete)
    } else if (dataset.comment) {
        handleCommentBtnClick(dataset.comment)
    }
}

function handleReplyClick(tweetId) {
    document.getElementById(`replies-${tweetId}`).classList.toggle('hidden')
}

function handleLikeClick(tweetId) {
    const targetTweetObj = tweets.find(({ uuid }) => uuid === tweetId)
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    targetTweetObj.isLiked ? targetTweetObj.likes++ : targetTweetObj.likes--
    render()
}

function handleRetweetClick(tweetId) {
    const targetTweetObj = tweets.find(({ uuid }) => uuid === tweetId)
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    targetTweetObj.isRetweeted ? targetTweetObj.retweets++ : targetTweetObj.retweets--
    render()
}

function handleDeleteClick(tweetId) {
    tweets = tweets.filter(({ uuid }) => uuid !== tweetId)
    render()
}

function handleCommentBtnClick(tweetId) {
    const commentInput = document.getElementById(`comment-input-${tweetId}`)
    const targetTweetObj = tweets.find(({ uuid }) => uuid === tweetId)

    if (!commentInput.value) return
    
    targetTweetObj.replies.unshift({
        handle: `@Scrimba`,
        profilePic: `images/scrimbalogo.png`,
        tweetText: commentInput.value,
    })
    commentInput.value = ''
    render()
}
