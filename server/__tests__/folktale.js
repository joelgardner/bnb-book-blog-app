import Result from 'folktale/result'

test('matchWith Error', () => {
  let r = fail('i failed you :(')
  expect(
    r.matchWith({
      Ok:     ({ value }) => "i love " + value,
      Error:  ({ value }) => "i hate that " + value
    })
  ).toBe("i hate that i failed you :(")
});

test('matchWith Ok', () => {
  let r = succeed('yayyy')
  expect(
    r.matchWith({
      Ok:     ({ value }) => "omg " + value,
      Error:  ({ value }) => "i hate that " + value
    })
  ).toBe("omg yayyy")
});

test('Result.chain Error', () => {
  let r = fail('i failed you :(')
  r.chain(result => {
    expect(0).toBe(1)
  }).orElse(err => {
    expect(err).toBe("i failed you :(")
  })
});

test('Result.chain Ok', () => {
  let r = succeed(1)
  r.chain(result => {
    expect(result).toBe(1)
    return succeed(result + 1)
  }).orElse(err => {
    expect(err).toBe("i failed you :(")
  })
  .chain(result => {
    expect(result).toBe(2)
  })
});


function succeed(msg) {
  return Result.Ok(msg)
}

function fail(msg) {
  return Result.Error(msg)
}
