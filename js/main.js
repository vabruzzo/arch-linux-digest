var FeedItem = React.createClass({displayName: "FeedItem",
  render: function() {
    return (
      React.createElement("div", {className: "feedItem"}, 
        React.createElement("h3", {className: "feedItemTitle"}, 
          React.createElement("a", {href: this.props.link, target: "_blank"}, this.props.title)
        ), 
        React.createElement("div", {className: "date"}, this.props.date), 
        React.createElement("span", {dangerouslySetInnerHTML: {__html: this.props.description}})
      )
    );
  }
});

var FeedList = React.createClass({displayName: "FeedList",
  render: function() {
    var feedNodes = this.props.data.map(function(item, index) {
      return (
        React.createElement(FeedItem, {title: item.title, description: item.content, link: item.link, date: item.publishedDate, key: index}
        )
      );
    });
    return (
      React.createElement("div", {className: "feedList"}, 
        feedNodes
      )
    );
  }
});

var Feed = React.createClass({displayName: "Feed",
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
      React.createElement("div", {className: "Feed"}, 
        React.createElement("h1", null, this.state.title), 
        React.createElement(FeedList, {data: this.state.data})
      )
    );
  }
});

React.render(
  React.createElement(Feed, {url: "https://www.archlinux.org/feeds/news/", numEntries: -1, pollInterval: 20000}),
  document.getElementById('News')
);

React.render(
  React.createElement(Feed, {url: "https://planet.archlinux.org/rss20.xml", numEntries: -1, pollInterval: 20000}),
  document.getElementById('Planet')
);

React.render(
  React.createElement(Feed, {url: "https://wiki.archlinux.org/index.php?title=Special:RecentChanges&feed=rss", numEntries: -1, pollInterval: 20000}),
  document.getElementById('Wiki')
);

React.render(
  React.createElement(Feed, {url: "https://bbs.archlinux.org/extern.php?action=feed&type=atom", numEntries: -1, pollInterval: 20000}),
  document.getElementById('Forums')
);

React.render(
  React.createElement(Feed, {url: "https://www.archlinux.org/feeds/packages/", numEntries: -1, pollInterval: 20000}),
  document.getElementById('Packages')
);

React.render(
  React.createElement(Feed, {url: "https://bugs.archlinux.org/feed.php?feed_type=rss2&project=0", numEntries: -1, pollInterval: 20000}),
  document.getElementById('Opened')
);

React.render(
  React.createElement(Feed, {url: "https://bugs.archlinux.org/feed.php?feed_type=rss2&topic=edit&project=0", numEntries: -1, pollInterval: 20000}),
  document.getElementById('Edited')
);

React.render(
  React.createElement(Feed, {url: "https://bugs.archlinux.org/feed.php?feed_type=rss2&topic=clo&project=0", numEntries: -1, pollInterval: 20000}),
  document.getElementById('Closed')
);
