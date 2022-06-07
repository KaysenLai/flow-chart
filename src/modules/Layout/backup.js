const aws = {
  StartAt: "Parallel",
  States: {
    Parallel: {
      Type: "Parallel",
      Branches: [
        {
          StartAt: "Lambda Invoke (1)",
          States: {
            "Lambda Invoke (1)": {
              Type: "Task",
              Next: "Pass",
            },
            Pass: {
              Type: "Pass",
              End: true,
            },
          },
        },
        {
          StartAt: "Lambda Invoke (2)",
          States: {
            "Lambda Invoke (2)": {
              Type: "Task",
              Next: "Pass (1)",
            },
            "Pass (1)": {
              Type: "Pass",
              End: true,
            },
          },
        },
      ],
      End: true,
    },
  },
};
