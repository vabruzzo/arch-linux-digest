var FeedItem = React.createClass({
  render: function() {
    return (
      <div className="feedItem">
        <h3 className="feedItemTitle">
          <a href={this.props.link} target="_blank">{this.props.title}</a>
        </h3>
        <div className="date">{this.props.date}</div>
        <span dangerouslySetInnerHTML={{__html: this.props.description}} />
      </div>
    );
  }
});

var FeedList = React.createClass({
  render: function() {
    var feedNodes = this.props.data.map(function(item, index) {
      return (
        <FeedItem title={item.title} description={item.content} link={item.link} date={item.publishedDate} key={index}>
        </FeedItem>
      );
    });
    return (
      <div className="feedList">
        {feedNodes}
      </div>
    );
  }
});

var Feed = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&num=' + this.props.numEntries + '&q=' + encodeURIComponent(this.props.url),
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({title: data.responseData.feed.title});
        this.setState({data: data.responseData.feed.entries});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="Feed">
        <h1>{this.state.title}</h1>
        <FeedList data={this.state.data} />
      </div>
    );
  }
});

React.render(
  <Feed url="https://www.archlinux.org/feeds/news/" numEntries={-1} pollInterval={20000} />,
  document.getElementById('News')
);

React.render(
  <Feed url="https://planet.archlinux.org/rss20.xml" numEntries={-1} pollInterval={20000} />,
  document.getElementById('Planet')
);

React.render(
  <Feed url="https://wiki.archlinux.org/index.php?title=Special:RecentChanges&feed=rss" numEntries={-1} pollInterval={20000} />,
  document.getElementById('Wiki')
);

React.render(
  <Feed url="https://bbs.archlinux.org/extern.php?action=feed&type=atom" numEntries={-1} pollInterval={20000} />,
  document.getElementById('Forums')
);

React.render(
  <Feed url="https://www.archlinux.org/feeds/packages/" numEntries={-1} pollInterval={20000} />,
  document.getElementById('Packages')
);

React.render(
  <Feed url="https://bugs.archlinux.org/feed.php?feed_type=rss2&project=0" numEntries={-1} pollInterval={20000} />,
  document.getElementById('Opened')
);

React.render(
  <Feed url="https://bugs.archlinux.org/feed.php?feed_type=rss2&topic=edit&project=0" numEntries={-1} pollInterval={20000} />,
  document.getElementById('Edited')
);

React.render(
  <Feed url="https://bugs.archlinux.org/feed.php?feed_type=rss2&topic=clo&project=0" numEntries={-1} pollInterval={20000} />,
  document.getElementById('Closed')
);
