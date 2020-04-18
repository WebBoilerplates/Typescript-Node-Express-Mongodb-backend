import Controller from '@lib/blueprint/Controller';
import Session from '@models/Session';

export default new (class extends Controller {
  constructor() {
    super();
    this.router.get('/', this.auth.authority.admin, this.getToken);
    this.router.delete('/', this.auth.authority.admin, this.deleteToken);
  }

  private getToken = this.Wrapper(async (req, res) => {
    let query = {};
    const { user, time, jwtid, skip, limit } = req.query;
    if (time) {
      query = Object.assign({}, query, {
        expire: { $lt: time.end, $gt: time.start },
      });
    }
    if (user) {
      query = Object.assign({}, query, { user: { $in: user } });
    }
    if (jwtid) {
      query = Object.assign({}, query, { jwtid });
    }
    const session = await Session.find(query)
      .skip(parseInt(skip || 0, 10))
      .limit(parseInt(limit || 10, 10))
      .exec();
    if (!session.length) throw this.error.db.notfound();
    res(200, session, {
      message: 'Found sessions',
    });
  });

  private deleteToken = this.Wrapper(async (req, res) => {
    let query = {};
    const { user, time, jwtid, unsafe } = req.query;
    if (time) {
      query = Object.assign({}, query, {
        expire: { $lt: time.end, $gt: time.start },
      });
    }
    if (user) {
      query = Object.assign({}, query, { user: { $in: user } });
    }
    if (jwtid) {
      query = Object.assign({}, query, { jwtid });
    }
    if (unsafe !== 'true' && JSON.stringify(query) === '{}') {
      throw this.error.action.unsafe();
    }
    const session = await Session.deleteMany(query).exec();
    if (!session.deletedCount) throw this.error.db.notfound();
    res(
      200,
      { amount: session.deletedCount },
      {
        message: `Disabled ${session.deletedCount} token session matches.`,
      },
    );
  });
})();
