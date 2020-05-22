const config = require('./config')
const twit = require('twit')
const T = new twit(config)

const BOT_NAME = '@bot_iroh'
const QUOTES = ['It is usually best to admit mistakes when they occur, and to seek to restore honor.', 'It is important to draw wisdom from many different sources.',
'It’s time for you to look inward and start asking yourself the big question: Who are you and what do you want?',
'Sharing tea with a fascinating stranger is one of life’s great delights.', 'Hope is something you give yourself. That is the meaning of inner strength.',
'Sometimes life is like this dark tunnel. You can’t always see the light at the end of the tunnel, but if you just keep moving you will come to a better place.',
'Destiny is a funny thing. You never know how things are going to work out. But if you keep an open mind and an open heart, I promise you will find your own destiny someday.',
'While it is always best to believe in oneself, a little help from others can be a great blessing.',
'Pride is not the opposite of shame, but its source. True humility is the only antidote to shame.', 'Life happens wherever you are, whether you make it or not.',
'You are not the man you used to be. You are stronger and wiser and freer than you ever used to be.', 'Protection and power are overrated. I think you are wise to choose happiness and love.',
'There are reasons each of us are born. We have to find those reasons.', 'Understanding others will help you become whole.',
'It is usually best to admit mistakes when they occur, and seek to restore honor.', 'Today, destiny is our friend. I know it.',
'There’s nothing wrong with a life of peace and prosperity. I suggest you think about what it is you want from life, and why.',
'I was about to ask you the same thing.', 'Are you so busy fighting you cannot see your own ship has set sail?',
'You must never give into despair. Allow yourself to slip down that road and you surrender to your lowest instincts.', 
'You should know that this is not a natural sickness. But that shouldn’t stop you from enjoying tea.',
'You sound like my nephew. Always thinking you need to do things on your own without anyone’s support.', 
'There is nothing wrong with letting people who love you, help you. Not that I love you. I just met you.', 'A man needs his rest.',
'Born in you along with all the strife is the power to restore balance to the world.', 'Is it your own destiny? Or is it a destiny someone else has tried to force on you?',
'You have light and peace inside of you. If you let it out, you can change the world around you.', 
'Sometimes the best way to solve your own problems is to help someone else.', 
'Even in the material world, you will find that if you look for the light, you can often find it. But if you look for the dark, that is all you will ever see.',
'Many things that seem threatening in the dark become welcoming when we shine light on them.']


function tweet(){

    //params for twitter search
    let params = {
        q: BOT_NAME + ' ?',
        result_type: 'recent',   
    }

    //Get number of quotes to determine how many numbers to generate
    const NUM_QUOTES = QUOTES.length
    
    //Open write stream to add tweet IDs to tracking file
    const fs = require('fs');
    var stream = fs.createWriteStream("resources/tweetIds.txt", {flags:'a'});

    //String variable to store list of already responded to tweets 
    var idList = ""

    //Populate idList from tweetIds.txt file
    const ids = fs.readFile('resources/tweetIds.txt', 'utf-8', (err, data)=> {
        if(data)
            idList = data.toString()
            console.log('...')
        if(err)
            console.log(err.message)
    })

    T.get('search/tweets', params, (err, data, response)=> {
        let tweets = data.statuses

        if(!err){
            for(let dat of tweets){
                //Skip tweet if it is a retweet or has already been responded to
                if (dat.hasOwnProperty("retweeted_status") || idList.includes(dat.id_str)){
                    continue;
                }
                    
                //Pick random quote from array
                let replyNum = Math.floor((Math.random() * NUM_QUOTES));
                let reply = QUOTES[replyNum]
                
                //Tweet message
                let tweetId = dat.id_str
                let name = '@' + dat.user.screen_name 
                T.post('statuses/update', {in_reply_to_status_id: tweetId, status: name + ' ' + reply}, function(err, data, response){
                    if(response)
                        console.log(reply)
                    if(err)
                        console.log(err.message)
                })
                //Write tweetId to file so bot knows not to respond again
                let data = tweetId + '\n'
                stream.write(data)
                   
            }
        }
    })
setTimeout(tweet, 15000);
}
setTimeout(tweet, 10)

//setTimeouts ensure it runs until stopped