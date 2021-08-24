import { Link, useRouteMatch } from "react-router-dom";
import "./node-list.scss";

const nodes = [
  {
    id: "foo",
    url: "http://foo.node.com",
  },
  {
    id: "bar",
    url: "http://bar.node.com",
  },
  {
    id: "baz",
    url: "http://baz.node.com",
  },
];

export const NodeList = () => {
  const match = useRouteMatch();
  return (
    <ul className="node-list">
      {nodes.map((n) => {
        return (
          <li key={n.id}>
            <Link to={`${match.path}/${n.id}`}>{n.id}</Link>
            <table>
              <tbody>
                <tr>
                  <th>Total stake</th>
                  <td>3000.00</td>
                  <td>34%</td>
                </tr>
                <tr>
                  <th>Your stake</th>
                  <td>0</td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
          </li>
        );
      })}
    </ul>
  );
};
