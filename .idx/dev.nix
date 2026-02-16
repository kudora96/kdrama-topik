{ pkgs, ... }: {
  channel = "stable-24.05";

  packages = [
    pkgs.python3
  ];

  idx = {
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["python3" "-m" "http.server" "9090" "--directory" "."];
          manager = "web";
        };
      };
    };
  };
}
