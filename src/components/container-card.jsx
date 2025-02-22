import PropTypes from "prop-types";
import { Play, Square, RefreshCw, Terminal } from "lucide-react";

function ContainerCard({ name, status, cpu, memory, disk }) {
  return (
    <div className="card neumorphic">
      <div className="card-header flex flex-row items-center justify-between pb-2">
        <h3 className="text-sm font-medium">{name}</h3>
        <span
          className={`badge ${status === "running" ? "badge-default" : "badge-secondary"}`}
        >
          {status}
        </span>
      </div>

      <div className="card-content">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>CPU</span>
            <span>{cpu}%</span>
          </div>
          <div className="h-1 bg-secondary rounded-full">
            <div className="h-1 bg-primary rounded-full" style={{ width: `${cpu}%` }} />
          </div>

          <div className="flex justify-between text-xs">
            <span>Memory</span>
            <span>{memory}%</span>
          </div>
          <div className="h-1 bg-secondary rounded-full">
            <div className="h-1 bg-primary rounded-full" style={{ width: `${memory}%` }} />
          </div>

          <div className="flex justify-between text-xs">
            <span>Disk</span>
            <span>{disk}%</span>
          </div>
          <div className="h-1 bg-secondary rounded-full">
            <div className="h-1 bg-primary rounded-full" style={{ width: `${disk}%` }} />
          </div>
        </div>
      </div>

      <div className="card-footer flex justify-between">
        <button className="btn-icon">
          {status === "running" ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <button className="btn-icon">
          <RefreshCw className="h-4 w-4" />
        </button>
        <button className="btn-icon">
          <Terminal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
ContainerCard.propTypes = {
  name: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  cpu: PropTypes.number.isRequired,
  memory: PropTypes.number.isRequired,
  disk: PropTypes.number.isRequired,
};

export default ContainerCard;

