// 依赖 store、Cookie 存储
// 用于用户不可主动点击前进、后退按钮的嵌入页面
// 结合 session cookie （关闭tab不行）或者 sessionStorage 实现重置 
// 所以采用 sessionStorage
let CHistory = window.CHistory = {
	// 最多记录50条
	HISTORY_MAX_LEN: 50, 

	// 历史记录最小值为1
	HISTORY_MIN_VALUE: 1, 

	start: function() {
		this.init();
	}, 
	init: function() {
		let t = this;

		let href = location.href;
		let hlen = history.length;

		// 关闭 tab 无法清除 session cookie 
		// Cookie.set('hc', 1, { domain: 'pc.huajiao.com', path: '/' });
		if( !sessionStorage.getItem('c') ) {
			console.log('sessionStorage reset');
			sessionStorage.setItem('c', 1);
			t.reset();
		};

		// 初始值存储值
		let hlist = store.get('hlist') || [];		// history list
		let hllen = store.get('hllen') || 0;		// history last len
		let hlpos = store.get('hlpos') || 0;		// history last position
		let ihlen = store.get('ihlen') || 0; 		// init history len
		
		// 记录初始历史长度
		if( hllen == 0 ) {
			store.set('ihlen', hlen-1);
		}
		// 实际有效的值
		hlen = hlen - ihlen;

		// history.go(n)  | history.backward() | history.forward() 历史记录长度不变
		// 根据历史记录变化操作
		if( hllen == 0 || hlen > hllen ) {
			hlist.push(href);
			// 超过最大值
			if( hlist.length > t.HISTORY_MAX_LEN ) {
				hlist = hlist.slice(0, t.HISTORY_MAX_LEN);
			}
			hllen = hlpos = hlist.length;
		} else if( hlen < hllen || hlen == hllen && hlist[hlen-1] == href ) {
			hlist = hlist.slice(0, hlen-1).concat([href]);
			hllen = hlpos = hlist.length;
		} else { 
			// do nothing
		}

		store.set('hlist', hlist);
		store.set('hlpos', hlpos);
		store.set('hllen', hllen);

		console.log(localStorage, history.length);
	}, 

	// 前进、后退n
	go: function(n) {
		let t = this;

		let hlist = store.get('hlist') || []
		let hlpos = store.get('hlpos') || 0;

		let nlpos = hlpos + n; 
		// 合法值允许跳转
		if( nlpos >= t.HISTORY_MIN_VALUE && nlpos <= hlist.length ) {
			store.set('hlpos', nlpos);
			history.go(n);
		}
	}, 

	// 前进
	forward: function() {
		let t = this;

		let hlist = store.get('hlist') || []
		let hlpos = store.get('hlpos') || 0;

		if( hlpos < hlist.length ) {
			store.set('hlpos', hlpos + 1);
			history.forward();	
		}
	}, 

	// 后退
	back: function() {
		let t = this;
		let hlist = store.get('hlist') || []
		let hlpos = store.get('hlpos') || 0;

		if( hlpos > t.HISTORY_MIN_VALUE ) {
			store.set('hlpos', hlpos - 1);
			history.back();	
		}
	}, 

	// 重置操作
	reset: function() {
		store.set('hlist', []);
		store.set('hlpos', 0);
		store.set('hllen', 0);
		store.set('ihlen', history.length);
	}, 

	// 搜索
	creturn: function() {
		let hlist = store.get('hlist') || [];
		let hlpos = store.get('hlpos') || 0;
		let searchReg = /\/search/;
		let videoReg = /\/v\/(\d+)/;
	}
};

// 开始
CHistory.start();