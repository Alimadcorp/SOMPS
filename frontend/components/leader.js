import { Trophy } from "lucide-react";
// slorpy was here
export default function Leader(
  data,
  title,
  scoreSuffix,
  scoreIcon,
  scoreIconTop,
  bgFill
) {
  let entries = data.data.filter((e) => { return e.image != null }); // i have no idea why i have to do this but yeah :heavysob:
  let top10 = entries.slice(0, 10);
  let next90 = entries.slice(10, 100);
  scoreIcon = data.scoreIcon;
  scoreSuffix = data.scoreSuffix;
  title = data.title; // breh
  bgFill = data.bgFill || false;
  scoreIconTop = data.scoreIconTop;
  function Card({ children, className = "" }) {
    return (
      <div
        className={`rounded-xl border shadow-lg backdrop-blur-sm ${className}`}
      >
        {children}
      </div>
    );
  }

  function CardHeader({ children, className = "" }) {
    return (
      <div className={`flex flex-col space-y-1.5 ${className}`}>{children}</div>
    );
  }

  function CardTitle({ children, className = "" }) {
    return (
      <h3 className={`font-semibold leading-none tracking-tight ${className}`}>
        {children}
      </h3>
    );
  }

  function CardContent({ children, className = "" }) {
    return <div className={className}>{children}</div>;
  }
  return (
    <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 backdrop-blur-sm">
      <CardHeader className="p-4 border-b border-gray-700/50">
        <CardTitle className="flex items-center gap-2 text-lg text-gray-200">
          <div className="p-1.5 rounded-lg bg-yellow-500/20">
            {scoreIconTop}
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 row-start-1">
            {top10.map((thing, index) => (
              <a
                key={thing.name || Math.random()}
                href={thing.url || "#"}
                className="group relative p-3 rounded-xl border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:bg-gray-800/50 hover:scale-105"
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-black shadow-lg">
                    {index + 1}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
                    <img
                      src={thing.image || "/placeholder.svg"}
                      alt={thing.name ? "." : "thing??"}
                      className="w-16 h-16 aspect-square object-cover rounded-[50%] border-1 border-gray-700 group-hover:border-gray-500 transition-all duration-300 relative z-10"
                    />
                  </div>
                  <div className="space-y-1 w-full">
                    <h3 className="font-medium text-xs max-w-full text-gray-200 group-hover:text-blue-400 transition-colors">
                      {(thing.name || "Unknown") +
                        (thing.author_name ? " by " + thing.author_name : "") ||
                        "Unknown"}
                    </h3>
                    <div className="flex items-center justify-center gap-1">
                      {scoreIcon}
                      <span className="text-xs text-gray-500">
                        {thing.score} {scoreSuffix}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${
                          top10[0]?.score > 0
                            ? ((thing.score || 0) / top10[0].score) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <details className="text-center mt-4 text-xl text-cyan-200">
            <summary>Show more</summary>
            <div className="grid grid-cols-1 gap-3 row-start-2">
              {next90.map((thing, index) => (
                <a
                  key={thing.name || Math.random()}
                  href={thing.url || "#"}
                  className="flex items-center gap-3 min-w-[220px] bg-gray-900 rounded-xl border border-gray-800 px-4 py-2 hover:border-gray-600 hover:bg-gray-800/50 transition-all duration-300"
                >
                  <div className="text-xs font-bold bg-yellow-500 text-black w-6 h-6 flex items-center justify-center rounded-full">
                    {index + 11}
                  </div>
                  <img
                    src={thing.image || "/placeholder.svg"}
                    alt={thing.name ? "." : "Gwok"}
                    className="w-12 h-12 aspect-square object-cover rounded-full border-1 border-gray-700"
                  />
                  <span className="text-sm font-medium text-gray-200 flex-1">
                    {(thing.name || "Unknown") +
                      (thing.author_name ? " by " + thing.author_name : "") ||
                      "Unknown"}
                  </span>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-auto">
                    {thing.score} {scoreSuffix}
                  </span>
                </a>
              ))}
            </div>
          </details>
        </div>
      </CardContent>
    </Card>
  );
}
